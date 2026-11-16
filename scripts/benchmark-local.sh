#!/bin/sh
set -eu

if [ "${1:-}" = "--help" ]; then
  echo 'Usage: FLOP_WORK_DIR=/absolute/work/path sh scripts/benchmark-local.sh'
  echo 'Downloads the pinned small model and benchmarks locally. No FLOP registration or signing.'
  exit 0
fi
[ "$(uname -s)" = Darwin ] && [ "$(uname -m)" = arm64 ] || {
  echo 'This recorded environment targets an Apple Silicon Mac.' >&2; exit 1;
}
command -v uv >/dev/null || { echo 'Install uv first: https://docs.astral.sh/uv/' >&2; exit 1; }
: "${FLOP_WORK_DIR:?Set an absolute work directory on your preferred disk}"
case "$FLOP_WORK_DIR" in /*) ;; *) echo 'Use an absolute FLOP_WORK_DIR.' >&2; exit 1;; esac
case "$FLOP_WORK_DIR" in /) echo 'Choose a dedicated working directory.' >&2; exit 1;; esac
case "$FLOP_WORK_DIR" in
  /Volumes/*)
    VOLUME_NAME=${FLOP_WORK_DIR#/Volumes/}
    VOLUME_PATH=/Volumes/${VOLUME_NAME%%/*}
    /sbin/mount | /usr/bin/grep -Fq -- " on $VOLUME_PATH (" || {
      echo 'The selected external volume is not mounted; no downloads started.' >&2; exit 1;
    }
    [ -w "$VOLUME_PATH" ] || { echo 'The selected volume is not writable.' >&2; exit 1; }
    ;;
esac
REPO_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
mkdir -p "$FLOP_WORK_DIR/cache/uv" "$FLOP_WORK_DIR/python" "$FLOP_WORK_DIR/tmp" "$FLOP_WORK_DIR/cache/huggingface"
export UV_CACHE_DIR="$FLOP_WORK_DIR/cache/uv"
export UV_PYTHON_INSTALL_DIR="$FLOP_WORK_DIR/python"
export TMPDIR="$FLOP_WORK_DIR/tmp"
export HF_HOME="$FLOP_WORK_DIR/cache/huggingface"
if [ ! -x "$FLOP_WORK_DIR/.venv/bin/python" ]; then
  uv venv --python 3.11.15 --managed-python "$FLOP_WORK_DIR/.venv"
fi
uv pip install --python "$FLOP_WORK_DIR/.venv/bin/python" -r "$REPO_DIR/requirements-observed.txt"
MODEL_SNAPSHOT=$(
  "$FLOP_WORK_DIR/.venv/bin/python" - <<'PY'
from huggingface_hub import snapshot_download
print(snapshot_download(
    'Qwen/Qwen2.5-0.5B-Instruct',
    revision='7ae557604adf67be50417f59c2c2f167def9a775',
))
PY
)
exec "$FLOP_WORK_DIR/.venv/bin/python" -m mlx_lm generate \
  --model "$MODEL_SNAPSHOT" \
  --prompt 'Explain in one short paragraph why a computer needs memory.' \
  --max-tokens 128 --temp 0

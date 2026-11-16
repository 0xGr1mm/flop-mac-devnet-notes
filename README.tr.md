# Mac mini M4 ile FLOP devnet denemesi

**16 Kasım 2026** tarihli deney kaydı. [English](README.md)

**Mac mini M4, 24 GB birleşik bellek** üzerinde, AI desteğiyle bir FLOP devnet denemesi yaptım. Qwen2.5-0.5B-Instruct modeli MLX ile yerelde çalıştı. istemci imzalı yanıtı doğruladı ve miner'a **0,99 test FLOP** ödemesi zincirde kesinleşti.

agent ve miner benim hesaplarımdı. bu bir işlev testi. **dış müşteri geliri, testnet ödül uygunluğu veya mainnet uyumluluğu kanıtlamıyor.** denenen yol legacy SOFT; **TOPLOC kapalıydı**.

## sonuçlar

| ölçüm | gözlem | neyi gösteriyor? |
|---|---:|---|
| yerel üretim hızı | 61,678 ve 85,828 token/s | iki ayrı kısa çalışma, her birinde 128 çıktı tokenı |
| MLX tepe belleği | 1,057 GB | model ölçümü; macOS'un geri kalanı dahil değil |
| kabul edilen devnet kapasitesi | 100 GFLOP/s | bilinçli olarak düşük tutulan protokol kapasitesi; bağımsız GPU benchmark'ı değil |
| tamamlanan referans görevleri | 72/72 | kayıt anında hatalı veya süresi dolmuş görev yok |
| ödemeli test isteği | 8 çıktı tokenı, 41 G_n | tek cooperative settlement |
| miner ödemesi | 0,99 test FLOP | kendi hesaplarım arasındaki test; test tokenının parasal değeri yok |
| ek GPU kiralaması | 0 dolar | mevcut Mac kullanıldı; elektrik ve cihaz maliyeti hesaplanmadı |

ilk çalışmada 85,828 token/s, depoyu hazırlarken yapılan tekrarda 61,678 token/s görüldü. bunlar iki kısa gözlem; sürekli performans tahmini değil.

model **Qwen/Qwen2.5-0.5B-Instruct, BF16**; sabit revizyon `7ae557604adf67be50417f59c2c2f167def9a775`. sonuç bu küçük model ve ayarlar için geçerli. 24 GB bellek sistemle paylaşılıyor; ayrı ekran kartı belleği değil.

## kanıtı kontrol et

[herkese açık kayıt](evidence/devnet-test.json), seçilmiş deney sonuçlarını ve public devnet kimliklerini içeriyor. cüzdan sırları, erişim anahtarları, özel ayarlar ve ham cihaz günlükleri paylaşılmadı.

- [ödeme işlemi](evidence/devnet-test.json): blok **3.852.620**.
- [devnet miner hesabı](https://explorer.devnet.flop.network/api/miners/5CeorJnvyF5sgjpk2AMAnutGXMCUsuXuNvpJjbqvD31A193U).
- deneme bitince miner zincirden çıkarıldı ve yerel servisler kapatıldı. sponsor stake'i sponsora ait.

doğrulama aracı public RPC'den okur. ağ kimliğini, tarihsel blok ve işlemi, eşleşen ödemeyi, kalibrasyonu, ilk denemenin iadesini ve çıkışı kontrol eder. **cüzdan açmaz, imza atmaz, fonlama/kayıt yapmaz veya sunucu kiralamaz.**

```sh
npm ci --ignore-scripts
npm run verify
```

Node 22 öneriliyor. varsayılan RPC `https://rpc.devnet.flop.network`; başka bir arşiv RPC'si için `FLOP_RPC` kullanılabilir. tarihsel verilere erişim gerekir. bağlantı hatası doğrulamanın yapılamadığı anlamına gelir. araç bir light client değildir; RPC verisini kontrol eder.

## tekrar denemek isteyenlere

- [yerel benchmark ve devnet adımları](docs/reproduction.md)
- [bileşenler, sürümler, düzeltmeler ve sınırlar](docs/experiment.md)
- [paylaşımda çıkarılan bilgiler](docs/privacy.md)

bu depo bir deney kaydı; çalıştırılabilir yerel benchmark ve salt okunur kanıt doğrulayıcı içeriyor. **tam miner kurucusu değil.** hesaplarıma bağlı işlem imzalama ve operasyon betikleri paylaşılmadı. yeni kurulumda güncel sürüm, kendi anahtarların, kayıt, kalibrasyon ve işlem sınırları ayrı hazırlanmalı.

## henüz doğrulanmayanlar

Apple GPU üzerinde TOPLOC, testnet kabulü ve ödülleri, büyük modeller, uzun süreli performans, dış müşteri talebi ve kârlılık bu denemeyle doğrulanmadı. legacy devnette ödeme almak bu soruların cevabı değil. harcama yapmadan veya miner'ı sürekli açık bırakmadan önce güncel sürümü ve ağ kurallarını kontrol et.

## kaynaklar

- [FLOP miner dokümanı](https://docs.flop.network/docs/run-miner)
- [resmî sürüm manifesti](https://flop.network/releases.json)
- [Apple Silicon / MLX tartışması](https://github.com/flop-labs/network/issues/268)
- [UfukNode NVIDIA rehberi](https://github.com/UfukNode/flop-miner-setup), worker ve devnet operasyonu için yararlı; Mac GPU kurulumu anlatmıyor.
- [MLX LM](https://github.com/ml-explore/mlx-lm)

[Grimm](https://github.com/0xGr1mm) tarafından AI desteğiyle hazırlanmış bağımsız topluluk kaydı. FLOP Labs ile bağlantı iddiası yok. diğer yazılımlar ve model ağırlıkları kendi lisanslarına tabi.

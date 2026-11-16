# Mac M4: gerçek TOPLOC kaydıyla takip denemesi

16 Kasım 2026'da önceki legacy SOFT denemesine gerçek model çalışmasından aynı geçişte alınan final-norm aktivasyon kaydını ekledim. kendi agent hesabım V3 makbuzunu doğruladı; aktivasyon ve oturum dökümü DA sağlayıcılarına ulaştı. **3904228** bloğunda miner'a **0.99 test FLOP** ödeme kesinleşti.

bu, kendi hesaplarım arasında operatör desteğiyle tamamladığım bir işlev testi. dış müşteri geliri, resmî Apple donanım kabulü, testnet puanı veya mainnet uyumluluğu göstermiyor. bağımsız validator model tekrar çalıştırması doğrulanmadı.

## kanıt

[seçilmiş public kayıt](../evidence/toploc-followup.json), iki denemeyi ve işlem kimliklerini ayrı içeriyor.

- başarılı kanal: `0x2d2466ad2889bbc9a3596072ccf08f7108367259772425a278d1216f9ded84a2`
- ödeme işlemi: `0x40c8fa08ff7bb11bf132fc9056851ba86a85085beb3c5bac62fbf614b92c1189`
- V3 makbuzu: 34 prompt tokenı, 8 çıktı tokenı, 41 GN; gerçek token kimliklerinin ve TOPLOC kaydının özetleri imzalı.
- aynı geçişte gerçek final-norm kaydı: BF16 Qwen2.5-0.5B-Instruct; önceki deneyle aynı kayıtlı model kökü ve sabit checkpoint.
- referans kalibrasyonu: 72/72 görev doğrulandı; 64 gerçek referans görevinden muhafazakâr 100 GFLOP/s protokol kapasitesi kabul edildi. bu, 100 token kazancı veya bağımsız fiziksel GPU benchmarkı değil.
- TOPLOC kökü ödeme öncesindeki kanonik durumdan doğrulandı; başarılı kapanışın ardından güncel işaret temizlendi. aktivasyon ve döküm, atanmış DA sağlayıcılarından ayrıca indirildi; kanonik baytlar, BLAKE2-256 ve SHA-256 özetleri eşleşti.

## ne değişti?

model mevcut Mac mini M4 / 24 GB birleşik bellekte native MLX ile çalıştı. resmî 0.1.358 paketinden çıkarılan worker kaynağı değiştirilmedi; native Node 24 ile kullanıldı. resmî Linux amd64 DA yardımcısı yerel Lima VM'sinde Rosetta üzerinden çalıştı. ek GPU veya sunucu kiralanmadı.

ilk tam kanıt denemesinde veriler yayınlandı, fakat yavaş RPC/DA işlemleri 600 blokluk süreyi aştı ve ödeme `AttestationStale` ile reddedildi. 1 test FLOP emanetin tamamı geri alındı; bu deneme başarı olarak gösterilmiyor.

ikinci kanalı 3600 blokluk pencere ve yine en fazla 1 test FLOP emanetle açtım. bu kez zincire girmeden geçerliliği dolan döküm kayıt işleminin 64 blokluk kanonik aralığını kontrol ettim. aynı kaydı resmî SDK üzerinden daha uzun işlem geçerliliğiyle tamamladım; son TOPLOC ve cooperative ödeme işlemlerini aynı mühürlü kayıt ve özgün agent imzasıyla resmî SDK üzerinden gönderdim. üçüncü kanal veya yeni kimlik açılmadı. kesin ödeme, özgün imzalı kapanış iddiası ve zincirdeki olayla karşılaştırıldı.

## sınırlar

worker aktivasyon için lanes-only biçimi kullandı; V3 makbuzu gerçek token kimliklerini ayrıca bağlıyor. bu sonuç, farklı donanımların sayısal eşdeğerliğini, sampling replay kontrolünü veya Apple/MLX donanım hücresinin resmî kabulünü göstermiyor. [Apple Silicon tartışması](https://github.com/flop-labs/network/issues/268) ve [resmî miner rehberi](https://docs.flop.network/docs/run-miner) bu ayrım için önemli.

depo bir deney kaydı olmaya devam ediyor. mevcut benchmark ve salt okunur doğrulayıcı **ilk legacy denemeyi** hedefliyor. hesaplara bağlı operasyon betikleri, cüzdan sırları, erişim anahtarları, audit şifreleme anahtarı ve ham günlükler paylaşılmıyor. yeni kayıt ayrı tutuldu; eski TOPLOC kapalı denemenin kanıtı korunuyor.

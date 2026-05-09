## Production Restore Notes

### Mongo restore
```powershell
mongorestore --uri="<MONGO_URI>" "<backup-folder>"
```

### Uploads restore
1. Yedek zip dosyasını açın.
2. İçeriği `backend/uploads` klasörüne geri koyun.

### Sıra önerisi
1. Uygulamayı durdurun
2. Mongo restore yapın
3. Uploads restore yapın
4. Uygulamayı yeniden başlatın

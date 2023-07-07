import { firebase } from "@/firebase/config";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage"

export class StorageService {
  public FOLDERS_PATHS = {
    AVATARS: "/images/avatars/",
    DEFAULT_AVATARS: "/images/avatars/default"
  }

  public async getFilesUrl(folderPath: string) {
    const storageRef = ref(firebase.storage, folderPath)
    const filesList = await listAll(storageRef)
    const urlPromises = filesList.items.map(getDownloadURL)

    return await Promise.all(urlPromises)
  }

  public async uploadFile(file: File, folderPath: string, userId: string) {
    const fileUrl = `${folderPath}/${userId}/${crypto.randomUUID()}-${file.name}`

    const imageRef = ref(firebase.storage, fileUrl)
    const { ref: uploadedFileRef } = await uploadBytes(imageRef, file)

    return await getDownloadURL(uploadedFileRef)
  }
}


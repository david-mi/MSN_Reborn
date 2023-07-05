import { firebase } from "@/firebase/config";
import { ref, listAll, getDownloadURL, StorageReference, uploadBytes } from "firebase/storage"

export class StorageService {
  public FOLDERS_PATHS = {
    AVATARS: "/images/avatars/",
    DEFAULT_AVATARS: "/images/avatars/default"
  }

  public async getFileUrl(fileRef: StorageReference) {
    return await getDownloadURL(fileRef)
  }

  public async getFilesUrl(folderPath: string) {
    const storageRef = ref(firebase.storage, folderPath)
    const filesList = await listAll(storageRef)
    const urlPromises = filesList.items.map(getDownloadURL)

    return await Promise.all(urlPromises)
  }

  public async uploadFile(file: File, folderPath: string, userId: string) {
    const imageRef = ref(firebase.storage, `${folderPath}/${userId}${file.name}`)
    const { ref: uploadedFileRef } = await uploadBytes(imageRef, file)

    return await this.getFileUrl(uploadedFileRef)
  }
}


import { firebase } from "@/firebase/config";
import { ref, listAll, getDownloadURL, ListResult } from "firebase/storage"

export class StorageService {
  public FOLDERS_PATHS = {
    AVATARS: "/images/avatars/",
    DEFAULT_AVATARS: "/images/avatars/default"
  }

  private async getUrlsFromStorageFilesList(filesList: ListResult) {
    const urlPromises = filesList.items.map(getDownloadURL)
    return await Promise.all(urlPromises)
  }

  private async getFilesListFromStorage(folderPath: string) {
    const storageRef = ref(firebase.storage, folderPath)
    return await listAll(storageRef)
  }

  public async getFilesUrl(folderPath: string) {
    const fileList = await this.getFilesListFromStorage(folderPath)
    return await this.getUrlsFromStorageFilesList(fileList)
  }
}
import { StorageService } from "./Storage"
import { firebase } from "@/firebase/config";
import { ref, uploadBytes, listAll, deleteObject } from "firebase/storage"

describe("StorageService", () => {
  describe("getFilesUrl", () => {
    beforeAll(async () => {
      const filesToUpload = [
        new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]),
        new Uint8Array([0x57, 0x6f, 0x72, 0x6c, 0x64]),
        new Uint8Array([0x48, 0x69, 0x21, 0x21])
      ];

      for (let i = 0; i < filesToUpload.length; i++) {
        const mockRef = ref(firebase.storage, `testing/file${i}`)
        await uploadBytes(mockRef, filesToUpload[i])
      }
    })

    afterAll(async () => {
      const storagefilesFolderRef = ref(firebase.storage, "testing")
      const filesFromStorage = await listAll(storagefilesFolderRef)
      for (const item of filesFromStorage.items) {
        await deleteObject(item)
      }
    })

    it("should return all files url from the targeted storage folder", async () => {
      const filesUrls = await StorageService.getFilesUrl("/testing")

      expect(filesUrls).toHaveLength(3)
      filesUrls.forEach((filesUrl) => {
        expect(filesUrls).toContain(filesUrl);
      });
    })
  })

  describe("uploadFile", () => {
    afterAll(async () => {
      const storagefilesFolderRef = ref(firebase.storage, "testing")
      const filesFromStorage = await listAll(storagefilesFolderRef)
      for (const item of filesFromStorage.items) {
        await deleteObject(item)
      }
    })

    it("should upload file to firebase storage and return url", async () => {
      const fileToUpload = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f])
      const userId = "2432DDDSF"

      await expect(StorageService.uploadFile(fileToUpload as any, "testing", userId))
        .resolves
        .toContain(userId)
    })
  })
})

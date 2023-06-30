import { StorageService } from "./Storage"
import { firebase } from "@/firebase/config";
import { ref, uploadBytes, listAll, deleteObject } from "firebase/storage"

let storageService: StorageService

beforeEach(() => {
  storageService = new StorageService()
})

describe("StorageService", () => {
  describe("getFilesUrl", () => {
    beforeAll(async () => {
      const fakeFilesToUpload = [
        new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]),
        new Uint8Array([0x57, 0x6f, 0x72, 0x6c, 0x64]),
        new Uint8Array([0x48, 0x69, 0x21, 0x21])
      ];

      for (let i = 0; i < fakeFilesToUpload.length; i++) {
        const mockRef = ref(firebase.storage, `testing/fakefile${i}`)
        await uploadBytes(mockRef, fakeFilesToUpload[i])
      }
    })

    afterAll(async () => {
      const storageFakeFilesFolderRef = ref(firebase.storage, "testing")
      const fakeFilesFromStorage = await listAll(storageFakeFilesFolderRef)
      for (const item of fakeFilesFromStorage.items) {
        await deleteObject(item)
      }
    })

    it("should return all files url from the targeted storage folder", async () => {
      const fakeFilesUrls = await storageService.getFilesUrl("/testing")

      expect(fakeFilesUrls).toHaveLength(3)
      fakeFilesUrls.forEach((fakeFilesUrl) => {
        expect(fakeFilesUrls).toContain(fakeFilesUrl);
      });
    })
  })
})

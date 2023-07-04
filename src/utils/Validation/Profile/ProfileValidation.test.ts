import { ProfileValidation } from "./ProfileValidation";

let profileValidation: ProfileValidation;

beforeEach(() => {
  profileValidation = new ProfileValidation();
});

describe("ProfileValidation", () => {
  describe("validateAvatar", () => {
    it("should return true for a valid avatar", () => {
      const avatar = new File(["avatar"], "avatar.jpg", { type: "image/jpeg" });
      Object.defineProperty(avatar, "size", { value: 200 * 1024 })
      const validationResult = profileValidation.validateAvatar(avatar);

      expect(validationResult).toBe(true);
    });

    it("should return the correct error message for an oversized avatar", () => {
      const avatar = new File(["avatar"], "avatar.jpg", { type: "image/jpeg" });
      Object.defineProperty(avatar, "size", { value: 600 * 1024 })

      const expectedErrorMessage = profileValidation.errorsMessages.avatar.TOO_BIG;
      const validationResult = profileValidation.validateAvatar(avatar);

      expect(validationResult).toEqual(expectedErrorMessage);
    });

    it("should return the correct error message for an unsupported avatar format", () => {
      const avatar = new File(["avatar"], "avatar.gif", { type: "image/gif" });
      const expectedErrorMessage = profileValidation.errorsMessages.avatar.WRONG_FORMAT;
      const validationResult = profileValidation.validateAvatar(avatar);

      expect(validationResult).toEqual(expectedErrorMessage);
    });
  });

  describe("validateUsername", () => {
    it("should return true for a valid username", () => {
      const username = "john.doe";
      const validationResult = profileValidation.validateUsername(username);

      expect(validationResult).toBe(true);
    });

    it("should return the correct error message for a username with less than 2 characters", () => {
      const username = "a";
      const expectedErrorMessage = profileValidation.errorsMessages.username.OUTSIDE_SIZE_RANGE;
      const validationResult = profileValidation.validateUsername(username);

      expect(validationResult).toEqual(expectedErrorMessage);
    });

    it("should return the correct error message for a username with more than 40 characters", () => {
      const username = "this-is-a-very-long-username-that-exceeds-the-maximum-character-limit";
      const expectedErrorMessage = profileValidation.errorsMessages.username.OUTSIDE_SIZE_RANGE;
      const validationResult = profileValidation.validateUsername(username);

      expect(validationResult).toEqual(expectedErrorMessage);
    });
  });
});

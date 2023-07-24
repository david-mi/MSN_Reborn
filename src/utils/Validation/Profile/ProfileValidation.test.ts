import { ProfileValidation } from "./ProfileValidation";

describe("ProfileValidation", () => {
  describe("validateAvatar", () => {
    it("should return true for a valid avatar", () => {
      const avatar = new File(["avatar"], "avatar.jpg", { type: "image/jpeg" });
      Object.defineProperty(avatar, "size", { value: 200 * 1024 })
      const validationResult = ProfileValidation.validateAvatar(avatar);

      expect(validationResult).toBe(true);
    });

    it("should return the correct error message for an oversized avatar", () => {
      const avatar = new File(["avatar"], "avatar.jpg", { type: "image/jpeg" });
      Object.defineProperty(avatar, "size", { value: 600 * 1024 })

      const expectedErrorMessage = ProfileValidation.errorsMessages.avatar.TOO_BIG;
      const validationResult = ProfileValidation.validateAvatar(avatar);

      expect(validationResult).toEqual(expectedErrorMessage);
    });

    it("should return the correct error message for an unsupported avatar format", () => {
      const avatar = new File(["avatar"], "avatar.gif", { type: "image/gif" });
      const expectedErrorMessage = ProfileValidation.errorsMessages.avatar.WRONG_FORMAT;
      const validationResult = ProfileValidation.validateAvatar(avatar);

      expect(validationResult).toEqual(expectedErrorMessage);
    });
  });

  describe("validateUsername", () => {
    it("should return true for a valid username", () => {
      const username = "john.doe";
      const validationResult = ProfileValidation.validateUsername(username);

      expect(validationResult).toBe(true);
    });

    it("should return the correct error message for a username with less than the minimum allowed characters", () => {
      const username = "a";
      const expectedErrorMessage = ProfileValidation.errorsMessages.username.OUTSIDE_SIZE_RANGE;
      const validationResult = ProfileValidation.validateUsername(username);

      expect(validationResult).toEqual(expectedErrorMessage);
    });

    it("should return the correct error message for a username with more than the maximum allowed characters", () => {
      const username = "this-is-a-very-long-username-that-exceeds-the-maximum-character-limit";
      const expectedErrorMessage = ProfileValidation.errorsMessages.username.OUTSIDE_SIZE_RANGE;
      const validationResult = ProfileValidation.validateUsername(username);

      expect(validationResult).toEqual(expectedErrorMessage);
    });
  });

  describe("validatePersonalMessage", () => {
    it("should return true for a valid personal message", () => {
      const personalMessage = "Bonjour les amis";
      const validationResult = ProfileValidation.validatePersonalMessage(personalMessage);

      expect(validationResult).toBe(true);
    });

    it("should return the correct error message for a personalMessage with more than the maximum allowed characters", () => {
      const personalMessage = `
      L’origine de la recette du Cassoulet : 

      Son origine remonte à l’époque médiévale, vers le XIV ème siècle.
      Le concepteur de la recette serait Guillaume Tirel, appelé  « Taillevent« , cuisinier des rois pendant plus de 60 ans.
      La première mention de ce plat serait apparue dans son ouvrage de cuisine « le Viandier » qui désigne un ragoût de mouton et de porc aux fèves.
      Selon la théorie de certains historiens, il se serait inspiré d’une recette empruntée aux arabes faisant la part belle aux épices et aux herbes.
      A ce titre, Le ragout de mouton aux fèves blanches fait partie des recettes du Traité de cuisine de Bagdad.
      Taillevent aurait repris cette recette et l’aurait adaptée.
      Les fèves furent ensuite remplacées par les haricots lingots, importés d’Amérique du sud par Christophe Colomb en 1530.
      `;
      const expectedErrorMessage = ProfileValidation.errorsMessages.personalMessage.TOO_LONG;
      const validationResult = ProfileValidation.validatePersonalMessage(personalMessage);

      expect(validationResult).toEqual(expectedErrorMessage);
    });
  });
});

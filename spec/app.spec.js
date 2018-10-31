var add = require("../app.js");

describe("Add functionality", () => {
    it("calculates correctly", () => {
        expect(add(10, 5)).toEqual(15);
    });

    it("Should return empty string", () => {
        expect(something()).toBe("");
    });

});


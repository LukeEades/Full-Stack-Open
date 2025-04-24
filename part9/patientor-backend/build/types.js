"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.assertNever = exports.EntryType = void 0;
var EntryType;
(function (EntryType) {
    EntryType["HealthCheck"] = "HealthCheck";
    EntryType["OccupationalHealthcare"] = "OccupationalHealthcare";
    EntryType["Hospital"] = "Hospital";
})(EntryType || (exports.EntryType = EntryType = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
    Gender["Other"] = "other";
})(Gender || (exports.Gender = Gender = {}));
const assertNever = (data) => {
    throw new Error(`type unused: ${JSON.stringify(data)}`);
};
exports.assertNever = assertNever;

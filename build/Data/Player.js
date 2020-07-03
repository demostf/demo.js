"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("./Vector");
var LifeState;
(function (LifeState) {
    LifeState[LifeState["ALIVE"] = 0] = "ALIVE";
    LifeState[LifeState["DYING"] = 1] = "DYING";
    LifeState[LifeState["DEATH"] = 2] = "DEATH";
    LifeState[LifeState["RESPAWNABLE"] = 3] = "RESPAWNABLE";
})(LifeState = exports.LifeState || (exports.LifeState = {}));
class Player {
    constructor(match, userInfo) {
        this.position = new Vector_1.Vector(0, 0, 0);
        this.viewAngles = new Vector_1.Vector(0, 0, 0);
        this.health = 0;
        this.maxHealth = 0;
        this.classId = 0;
        this.team = 0;
        this.viewAngle = 0;
        this.weaponIds = [];
        this.ammo = [];
        this.lifeState = LifeState.DEATH;
        this.activeWeapon = 0;
        this.match = match;
        this.user = userInfo;
    }
    get weapons() {
        return this.weaponIds
            .map((id) => this.match.outerMap.get(id))
            .filter((entityId) => entityId > 0)
            .map((entityId) => this.match.weaponMap.get(entityId));
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map
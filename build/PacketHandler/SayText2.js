"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleSayText2(packet, match) {
    if (packet.kind === '#TF_Name_Change') {
        for (const user of match.users.values()) {
            if (user.name === packet.from) {
                user.name = packet.text;
            }
        }
        return;
    }
    match.chat.push({
        kind: packet.kind,
        from: packet.from,
        text: packet.text,
        tick: match.tick
    });
}
exports.handleSayText2 = handleSayText2;
//# sourceMappingURL=SayText2.js.map
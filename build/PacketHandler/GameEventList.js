"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleGameEventList(packet, state) {
    state.eventDefinitions = packet.eventList;
    const entries = Array.from(packet.eventList.entries());
    const reversedEntries = entries.map(([type, definition]) => [definition.name, type]);
    state.eventDefinitionTypes = new Map(reversedEntries);
}
exports.handleGameEventList = handleGameEventList;
//# sourceMappingURL=GameEventList.js.map
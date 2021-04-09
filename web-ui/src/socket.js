import {Socket, Presence} from "phoenix";
const uuid = require("uuid");

let socket = new Socket("wss://api.pearcode.swoogity.com/socket", {params: {token: ""}})

socket.connect();


// object of set state functions
// - setBody | string
// - setParticipants | list
// - setExecuting | bool
// - setResult | obj
// - setLanguage | int
// - setConnected | int (0: not connected, 1: connected, 2: some error connecting)
let statefns = null;

let channel = null;
let presence = null;

export function ch_join_limited(stf) {

    channel = socket.channel(`lobby:${uuid.v4()}`, {name: "", user_id: 0});
    statefns = stf;
    presence = new Presence(channel);

    channel.join()
        .receive("ok", (resp) => {
            statefns.setBody(resp.body);
            statefns.setConnected(1);
        })
        .receive("error", (resp) => {
            console.log("unable to join:", resp);
            statefns.setConnected(2);
        });

    channel.on("executing", () => {statefns.setExecuting(true)});
    channel.on("submission_result", (resp) => {
        statefns.setExecuting(false);
        statefns.setResult(resp);
    });
}

export function ch_join(lobby, name, user_id, file_id, stf) {
    channel = socket.channel(`lobby:${lobby}`, {name: name, user_id: user_id, file_id: file_id});
    statefns = stf;
    presence = new Presence(channel);

    presence.onSync(() => {
        statefns.setParticipants(presence.list().map(p => p.metas[0]));
    });

    channel.join()
        .receive("ok", (resp) => {
            statefns.setBody(resp.body);
            statefns.setConnected(1);
        })
        .receive("error", (resp) => {
            console.log("unable to join:", resp);
            statefns.setConnected(2);
        });

    channel.on("updated", (resp) => {statefns.setBody(resp.body);});
    channel.on("executing", () => {statefns.setExecuting(true)});
    channel.on("submission_result", (resp) => {
        statefns.setExecuting(false);
        statefns.setResult(resp);
    });
    channel.on("new_language", (resp) => {
        statefns.setLanguage(resp['language']);
    });
}

export function ch_update(body) {
    channel.push("update", {body: body});
}

export function ch_leave() {
    if (channel) {
        channel.leave();
    }
}

export function ch_stop_typing() {
    channel.push("stoptyping", null);
}

export function ch_execute(language) {
    channel.push("execute", {language: language});
}

export function ch_language(language) {
    channel.push("set_language", {language: language});
}
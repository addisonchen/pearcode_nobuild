defmodule PearcodeWeb.LobbyChannel do
  use PearcodeWeb, :channel

  alias Pearcode.Lobby
  alias Pearcode.LobbyServer
  alias Pearcode.JudgeHandler
  alias PearcodeWeb.LobbyPresence

  @impl true
  def join("lobby:" <> id, payload, socket) do

      if Map.has_key?(payload, "file_id") do
        LobbyServer.start(id, payload["file_id"])
      else
        LobbyServer.start(id)
      end
      
      
      socket = assign(socket, :lobby_id, id)
      socket = assign(socket, :user_name, payload["name"])
      socket = assign(socket, :user_id, payload["user_id"])
      socket = assign(socket, :executing, false)
      socket = assign(socket, :typing, false)

      lobby = LobbyServer.peek(id)

      send(self(), {:after_join, lobby})
      {:ok, lobby, socket}
  end

  @impl true
  def handle_info({:after_join, _lobby}, socket) do
      LobbyPresence.track_user_join(socket, socket.assigns.user_name, socket.assigns.user_id)
      push(socket, "presence_state", LobbyPresence.list(socket))
      {:noreply, socket}
  end

  @impl true
  def handle_in("update", payload, socket) do
      ex = socket.assigns[:executing]

      LobbyPresence.do_user_update(socket, socket.assigns.lobby_id, socket.assigns.user_id, socket.assigns.user_name, %{typing: true, executing: ex})

      lobby_id = socket.assigns[:lobby_id]
      lobby = LobbyServer.update(lobby_id, payload["body"])

      broadcast_from! socket, "updated", lobby

      socket = assign(socket, :typing, true)
      {:noreply, socket}
  end

  @impl true
  def handle_in("stoptyping", _payload, socket) do
    ex = socket.assigns[:executing]
    LobbyPresence.do_user_update(socket, socket.assigns.lobby_id, socket.assigns.user_id, socket.assigns.user_name, %{typing: false, executing: ex})
    socket = assign(socket, :typing, false)
    {:noreply, socket}
  end

  @impl true
  def handle_in("execute", payload, socket) do
      if !(socket.assigns[:executing]) do
        tp = socket.assigns[:typing]
        LobbyPresence.do_user_update(socket, socket.assigns.lobby_id, socket.assigns.user_id, socket.assigns.user_name, %{typing: tp, executing: true})
        socket = assign(socket, :executing, true)
        
        lobby_id = socket.assigns[:lobby_id]
        user_id = socket.assigns[:user_id]
        lobby = LobbyServer.peek(lobby_id)
        if lobby[:body] != "" do
          JudgeHandler.execute(lobby[:body], payload["language"], lobby_id, user_id)
          push(socket, "executing", lobby)
        end
      end
      {:noreply, socket}
  end

  @impl true
  def handle_in("set_language", payload, socket) do
      language_id = payload["language"]
      broadcast! socket, "new_language", %{language: language_id}

      {:noreply, socket}
  end

  intercept ["submission_result"]

  @impl true
  def handle_out("submission_result", msg, socket) do
    user_id = socket.assigns[:user_id]

    if msg[:user_id] == user_id do
      tp = socket.assigns[:typing]
      LobbyPresence.do_user_update(socket, socket.assigns.lobby_id, socket.assigns.user_id, socket.assigns.user_name, %{typing: tp, executing: false})
      socket = assign(socket, :executing, false)
      push(socket, "submission_result", msg)
    end

    {:noreply, socket}
  end


end

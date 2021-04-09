defmodule PearcodeWeb.LobbyPresence do
  use Phoenix.Presence, otp_app: :pearcode,
      pubsub_server: Pearcode.PubSub

  # TODO change name to user (db item)
  def track_user_join(socket, user_name, user_id) do
      track(socket, user_id, %{
          executing: false,
          typing: false,
          name: user_name,
          user_id: user_id
      })
  end

  def do_user_update(socket, lobby_id, user_id, user_name, %{typing: typing, executing: executing}) do
      update(socket, user_id, %{
          executing: executing,
          typing: typing,
          name: user_name,
          user_id: user_id
      })
  end
end

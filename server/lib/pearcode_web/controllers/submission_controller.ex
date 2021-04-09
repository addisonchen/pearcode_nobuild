defmodule PearcodeWeb.SubmissionController do
  use PearcodeWeb, :controller

  def receive_webhook(conn, params) do

      lobby_id = conn.path_params["lobby_id"]
      user_id = conn.path_params["user_id"]

      headers = ["Content-Type": "application/json", "X-Auth-Token": "phut1Vahgh9faik4oire"]
      url = "http://localhost:2358/submissions/#{params["token"]}?base64_encoded=false"
      resp = HTTPoison.get!(url, headers, [])
      body = Jason.decode!(resp.body)

      # IDEA:
      body = Map.put(body, :user_id, String.to_integer(user_id))
      PearcodeWeb.Endpoint.broadcast!("lobby:#{lobby_id}", "submission_result", body)
      # in the lobby_channel, intercept the broadcast and compare user name, then broadcast to your channel if the name is correct
      conn
      |> resp(400, "ok")
      |> send_resp
  end
end

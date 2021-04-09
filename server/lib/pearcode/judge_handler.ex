defmodule Pearcode.JudgeHandler do
  # python 3.8.1 -> 71
  # Swift 5.2.3 -> 83
  # JavaScript 12.14.0 -> 63
  # Java 13.0.1 -> 62
  # C GCC 9.2.0 -> 50
  # C++ GCC 9.2.0 -> 54
  # Elixer 1.9.4 -> 57
  # Prolog (GNU Prolog 1.4.5) -> 69
  # Ruby (2.7.0) -> 72


  def execute(code, language_id, lobby_id, user_id) do
      url = "http://localhost:2358/submissions/?base64_encoded=false&wait=false"
      headers = ["Content-Type": "application/json", "X-Auth-Token": "phut1Vahgh9faik4oire"]

      callback_url = "https://api.pearcode.swoogity.com/api/v1/submissions/#{lobby_id}/#{user_id}"


      body = Jason.encode!(%{
          source_code: code,
          language_id: language_id,
          callback_url: callback_url
      })
      {:ok, response} = HTTPoison.post(url, body, headers)
  end
end

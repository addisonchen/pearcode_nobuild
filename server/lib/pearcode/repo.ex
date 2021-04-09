defmodule Pearcode.Repo do
  use Ecto.Repo,
    otp_app: :pearcode,
    adapter: Ecto.Adapters.Postgres
end

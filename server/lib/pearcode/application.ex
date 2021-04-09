defmodule Pearcode.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Pearcode.Repo,
      # Start the Telemetry supervisor
      PearcodeWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Pearcode.PubSub},
      PearcodeWeb.LobbyPresence,
      # Start the Endpoint (http/https)
      PearcodeWeb.Endpoint,
      # Start a worker by calling: Pearcode.Worker.start_link(arg)
      # {Pearcode.Worker, arg}
      Pearcode.LobbySupervisor
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Pearcode.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    PearcodeWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end

defmodule Pearcode.LobbyServer do
  use GenServer

  alias Pearcode.Lobby

  def reg(name) do
    {:via, Registry, {Pearcode.LobbyReg, name}}
  end

  def start(name, file_id) do
    spec = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [name, file_id]},
      restart: :permanent,
      type: :worker
    }
    Pearcode.LobbySupervisor.start_child(spec)
  end

  def start(name) do
    spec = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [name]},
      restart: :permanent,
      type: :worker
    }
    Pearcode.LobbySupervisor.start_child(spec)
  end

  def start_link(name, file_id) do
    lobby = Lobby.new(file_id)
    GenServer.start_link(
      __MODULE__,
      lobby,
      name: reg(name)
    )
  end

  def start_link(name) do
    lobby = Lobby.new()
    GenServer.start_link(
      __MODULE__,
      lobby,
      name: reg(name)
    )
  end

  def update(name, code) do
    GenServer.call(reg(name), {:update, name, code})
  end

  def peek(name) do
    GenServer.call(reg(name), {:peek, name})
  end

  # implementation


  def handle_call({:update, _name, code}, _from, lobby) do
    lobby = Lobby.update(lobby, code)
    {:reply, lobby, lobby}
  end

  def handle_call({:peek, _name}, _from, lobby) do
    {:reply, lobby, lobby}
  end
end

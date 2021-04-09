defmodule Pearcode.Lobby do


  # create a new blank lobby
  def new(file_id) do
    file = Pearcode.Files.get_just_file(file_id)
    %{
      body: file.body,
    }
  end

  def new() do
    %{
      body: "",
    }
  end

  def update(st, code) do
    Map.replace(st, :body, code)
  end


end

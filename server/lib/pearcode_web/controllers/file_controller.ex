defmodule PearcodeWeb.FileController do
  use PearcodeWeb, :controller

  alias Pearcode.Files
  alias Pearcode.Files.File
  alias PearcodeWeb.Plugs

  plug Plugs.RequireAuth when action in [:create]
  plug :requireOwner when action in [:update, :delete]

  action_fallback PearcodeWeb.FallbackController

  def requireOwner(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id",
          token, max_age: 86400*3) do
      {:ok, user_id} ->
        file = Pearcode.Files.get_file!(conn.params["id"])
        if file.user_id == user_id do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "this is not your file"}))
          |> halt()
        end
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity,Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end

  def index(conn, _params) do
    files = Files.list_files()
    render(conn, "index.json", files: files)
  end

  def create(conn, %{"file" => file_params}) do
    case Files.create_file(file_params) do
      {:ok, %File{} = file} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.file_path(conn, :show, file))
        |> render("show.json", file: file)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> put_view(PearcodeWeb.ErrorView)
        |> render("error.json", changeset: changeset)
      _ -> raise "Unknown response: file_controller -> create -> default case"
    end
  end

  def show(conn, %{"id" => id}) do
    file = Files.get_file!(id)
    render(conn, "showExpanded.json", file: file)
  end

  def update(conn, %{"id" => id, "file" => file_params}) do
    file = Files.get_file!(id)

    with {:ok, %File{} = file} <- Files.update_file(file, file_params) do
      render(conn, "show.json", file: file)
    end
  end

  def delete(conn, %{"id" => id}) do
    file = Files.get_file!(id)

    with {:ok, %File{}} <- Files.delete_file(file) do
      send_resp(conn, :no_content, "")
    end
  end
end

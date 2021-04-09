defmodule PearcodeWeb.UserController do
  use PearcodeWeb, :controller

  alias Pearcode.Users
  alias Pearcode.Users.User

  plug :requireOwner when action in [:update, :delete]

  action_fallback PearcodeWeb.FallbackController


  def requireOwner(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id",
          token, max_age: 86400*3) do
      {:ok, user_id} ->
        user = Pearcode.Users.get_user!(conn.params["id"])
        if user.id == user_id do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "this is not your account"}))
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
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    case Users.create_user(user_params) do
      {:ok, %User{} = user} ->
        conn
        |> PearcodeWeb.SessionController.create(%{"email" => user.email, "password" => user_params["password"]})
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> put_view(PearcodeWeb.ErrorView)
        |> render("error.json", changeset: changeset)
      _ -> raise "Unknown response: user_controller -> create -> default case"
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)
    case Users.update_user(user, user_params) do
      {:ok, %User{} = user} ->
        conn
        |> render("show.json", user: user)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> put_view(PearcodeWeb.ErrorView)
        |> render("error.json", changeset: changeset)
      _ -> raise "Unknown response: user_controller -> update -> default case"
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end

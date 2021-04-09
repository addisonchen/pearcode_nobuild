defmodule PearcodeWeb.CommentController do
  use PearcodeWeb, :controller

  alias Pearcode.Comments
  alias Pearcode.Comments.Comment

  plug :requireInvitedOrOwner when action in [:create]
  plug :requireOwner when action in [:update, :delete]

  action_fallback PearcodeWeb.FallbackController

  def requireInvitedOrOwner(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id",
          token, max_age: 86400*3) do
      {:ok, user_id} ->
        user = Pearcode.Users.get_user!(user_id)
        invite = Pearcode.Invites.get_invite(conn.params["comment"]["file_id"], user.email)
        file = Pearcode.Files.get_file!(conn.params["comment"]["file_id"])
        if (invite != nil) || (user_id == file.user_id) do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "You are not invited"}))
          |> halt()
        end
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity,Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end

  def requireOwner(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id",
          token, max_age: 86400*3) do
      {:ok, user_id} ->
        comment = Pearcode.Comments.get_comment!(conn.params["id"])
        if (user_id == comment.user_id) || (user_id == comment.file.user_id) do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "This is not your comment"}))
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
    comments = Comments.list_comments()
    render(conn, "index.json", comments: comments)
  end

  def create(conn, %{"comment" => comment_params}) do
    with {:ok, %Comment{} = comment} <- Comments.create_comment(comment_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.comment_path(conn, :show, comment))
      |> render("show.json", comment: comment)
    end
  end

  def show(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)
    render(conn, "show.json", comment: comment)
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Comments.get_comment!(id)

    with {:ok, %Comment{} = comment} <- Comments.update_comment(comment, comment_params) do
      render(conn, "show.json", comment: comment)
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)

    with {:ok, %Comment{}} <- Comments.delete_comment(comment) do
      send_resp(conn, :no_content, "")
    end
  end
end

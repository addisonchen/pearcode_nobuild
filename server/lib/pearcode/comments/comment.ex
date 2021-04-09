defmodule Pearcode.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:body, :user_id, :id, :user]}

  schema "comments" do
    field :body, :string
    belongs_to :user, Pearcode.Users.User
    belongs_to :file, Pearcode.Files.File

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body, :user_id, :file_id])
    |> validate_required([:body, :user_id, :file_id])
  end
end

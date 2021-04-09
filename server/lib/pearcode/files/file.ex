defmodule Pearcode.Files.File do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:body, :description, :language, :name, :id]}

  schema "files" do
    field :description, :string
    field :name, :string
    field :language, :integer
    field :body, :string
    belongs_to :user, Pearcode.Users.User

    has_many :invites, Pearcode.Invites.Invite, on_delete: :delete_all
    has_many :comments, Pearcode.Comments.Comment, on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(file, attrs) do
    file
    |> cast(attrs, [:name, :body, :language, :user_id, :description])
    |> validate_required([:name, :language, :user_id])
  end
end

defmodule Pearcode.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:name, :email]}

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string

    has_many :files, Pearcode.Files.File, on_delete: :delete_all
    has_many :comments, Pearcode.Comments.Comment, on_delete: :delete_all


    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email])
    |> add_password_hash(attrs["password"])
    |> validate_required([:name, :email, :password_hash])
    |> unique_constraint(:email)
  end

  def add_password_hash(cset, nil) do
    cset
  end

  def add_password_hash(cset, password) do
    change(cset, Argon2.add_hash(password))
  end
end

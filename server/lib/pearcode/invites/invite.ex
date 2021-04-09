defmodule Pearcode.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:email, :id]}

  schema "invites" do
    field :email, :string
    belongs_to :file, Pearcode.Files.File

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:email, :file_id])
    |> validate_required([:email, :file_id])
  end
end

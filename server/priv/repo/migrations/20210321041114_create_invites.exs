defmodule Pearcode.Repo.Migrations.CreateInvites do
  use Ecto.Migration

  def change do
    create table(:invites) do
      add :email, :string, null: false
      add :file_id, references(:files, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:invites, [:file_id])
  end
end

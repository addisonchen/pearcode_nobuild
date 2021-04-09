defmodule Pearcode.Repo.Migrations.CreateFiles do
  use Ecto.Migration

  def change do
    create table(:files) do
      add :name, :string, null: false
      add :body, :text, default: ""
      add :language, :integer, null: false
      add :description, :text, default: ""
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:files, [:user_id])
  end
end

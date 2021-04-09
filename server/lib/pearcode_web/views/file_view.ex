defmodule PearcodeWeb.FileView do
  use PearcodeWeb, :view
  alias PearcodeWeb.FileView

  def render("index.json", %{files: files}) do
    %{data: render_many(files, FileView, "file.json")}
  end

  def render("showExpanded.json", %{file: file}) do
    %{data: render_one(file, FileView, "fileExpanded.json")}
  end

  def render("show.json", %{file: file}) do
    %{data: render_one(file, FileView, "file.json")}
  end

  def render("file.json", %{file: file}) do
    %{id: file.id,
      name: file.name,
      body: file.body,
      language: file.language,
      description: file.description
    }
  end

  def render("fileExpanded.json", %{file: file}) do
    %{id: file.id,
      name: file.name,
      body: file.body,
      language: file.language,
      description: file.description,
      invites: file.invites,
      comments: file.comments,
      user_name: file.user.name,
      user_id: file.user.id,
      user_email: file.user.email
    }
  end
end

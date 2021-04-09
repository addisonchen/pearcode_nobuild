defmodule PearcodeWeb.InviteView do
  use PearcodeWeb, :view
  alias PearcodeWeb.InviteView

  def render("index.json", %{invites: invites}) do
    %{data: render_many(invites, InviteView, "inviteExpanded.json")}
  end

  def render("show.json", %{invite: invite}) do
    %{data: render_one(invite, InviteView, "invite.json")}
  end

  def render("invite.json", %{invite: invite}) do
    %{id: invite.id,
      email: invite.email}
  end

  def render("inviteExpanded.json", %{invite: invite}) do
    %{id: invite.id,
      email: invite.email,
      file: invite.file }
  end
end

defmodule PearcodeWeb.PageController do
  use PearcodeWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end

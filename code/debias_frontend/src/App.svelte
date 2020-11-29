<script>
  import router from "page";
  import Home from "./pages/Home.svelte";
  import Logs from "./pages/Logs.svelte";
  import ThemeToggle from "./components/ThemeToggle.svelte";

  let page;

  router("/", () => (page = Home));
  router("/logs", () => (page = Logs));

  router.start();
</script>

<style>
  header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .nav {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
    height: 64px;
  }
  .navlink {
    list-style: none;
    padding: 0;
  }
  .navlink a {
    color: var(--font-color);
    text-decoration: none;
    font-size: 1.2em;
    padding: 24px;
  }
  .navlink a:hover {
    background-color: var(--chip-hover-color);
  }
</style>

<header>
  <ul class="nav">
    <li class="navlink"><a href="/">Home</a></li>
    <li class="navlink"><a href="/logs">Logs</a></li>
    <li class="navlink"><a href="/logs">Analysis (W.I.P.)</a></li>
    <li class="navlink">
      <ThemeToggle />
    </li>
  </ul>
</header>

<svelte:component this={page} />

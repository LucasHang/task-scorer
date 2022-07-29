<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<svelte:head>
	<title>Task Scorer</title>
	<meta name="description" content="Peer to peer application for scoring tasks for free!!" />
</svelte:head>

<Header />

<main class="flex-1 flex center">
	<slot />
</main>

<footer class="footer footer-center p-4 bg-base-300 text-base-content">
	<p>By <a href="https://github.com/LucasHang" target="_blank">Lucas Hang</a></p>
</footer>

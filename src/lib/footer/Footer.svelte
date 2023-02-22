<script lang="ts">
	import GithubIcon from '$lib/icons/GithubIcon.svelte';
</script>

<footer class="footer items-center p-2 bg-base-300 text-base-content">
	<div class="items-center grid-flow-col">
		<small>Copyright © {new Date().getFullYear()} - All right reserved</small>
	</div>

	<div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
		<a href="https://github.com/LucasHang/task-scorer" target="_blank">
			<GithubIcon />
		</a>
	</div>
</footer>

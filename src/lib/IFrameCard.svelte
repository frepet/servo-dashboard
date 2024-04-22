<script lang="ts">
	import { state } from '$lib/stores/StateStore';
	import Card, { Content } from '@smui/card';

	let url: string = '';

	url = $state.iframeSettings.src;
</script>

<Card>
	<Content>
		<div class="content">
			<form>
				URL:
				<input type="url" bind:value={url} />
				<button
					on:click={() => {
						$state.iframeSettings.src = url;
					}}>Update</button
				>
			</form>

			<span>
				Height:
				<input type="number" bind:value={$state.iframeSettings.height} />
			</span>
			<div class="resizer">
				<iframe
					src={$state.iframeSettings.src}
					title="Custom Iframe"
					height={$state.iframeSettings.height}
				/>
			</div>
		</div>
	</Content>
</Card>

<style>
	.content {
		display: flex;
		flex-direction: column;
	}

	iframe {
		width: 100%;
		pointer-events: none;
		border: none;
	}
</style>

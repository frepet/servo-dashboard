<Card>
	<Content>
		<Accordion multiple>
			{#each servos as id}
			<Panel>
				<Header>Servo {id}</Header>
				<Content>
					<Servo {id}/>
				</Content>
			</Panel>
			{/each}

		</Accordion>
	</Content>
	<Actions>
		<ActionButtons>
			<Button on:click={() => { servos = [...servos, nextID]; nextID++;}} title="Add">
				<Label>Add</Label>
			</Button>
		</ActionButtons>
	</Actions>
</Card>

<script lang="ts">
	import Servo from "./Servo.svelte";

    import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";
	import Card, { Actions, ActionButtons } from "@smui/card";
	import Button, { Label } from "@smui/button";
	let servos = [0, 1, 2, 3];
	let nextID = 4;
</script>

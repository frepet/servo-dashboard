<script>
	import { state } from '$lib/stores/StateStore';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import Card from '@smui/card';
    import Switch from '@smui/switch';
</script>

<Card>
    <Accordion>
        <Panel>
            <Header>Settings</Header>
            <Content>
                <span>
                    <Switch bind:checked={$state.settings.IKEnabled}></Switch>
                    Inverse Kinematics
                </span>
            </Content>
        </Panel>
    </Accordion>
</Card>
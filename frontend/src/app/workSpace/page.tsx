"use client";
import { useCallback } from 'react';
import ReactFlow, {
	Node,
	useNodesState,
	useEdgesState,
	addEdge,
	Connection,
	Edge,
	ConnectionLineType,
	Background,
} from 'reactflow';
import styles from './Flow.module.css';
import CustomNode from './components/organisms/CustomNode';

const initialNodes: Node[] = [
	{
		id: '1',
		type: 'input',
		data: { label: 'Module 1' },
		position: { x: 250, y: 5 },
	},
	{
		id: '2',
		data: { label: 'Module 2' },
		position: { x: 100, y: 100 },
	},
	{
		id: '3',
		data: { label: 'Module 3' },
		position: { x: 400, y: 100 },
	},
	{
		id: '4',
		data: { label: 'Module 4' },
		position: { x: 400, y: 200 },
		type: 'custom',
		className: styles.customNode,
	},
];

const initialEdges: Edge[] = [
	{ id: 'e1-2', source: '1', target: '2' },
	{ id: 'e1-3', source: '1', target: '3' },
];

const nodeTypes = {
	custom: CustomNode,
};

const defaultEdgeOptions = {
	animated: true,
	type: 'smoothstep',
};



export default function workspace() {

	const [nodes, , onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const onConnect = useCallback(
		(params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);
	return (
		<>
			<div className={styles.flow}>
				<ReactFlow
					nodes={nodes}
					onNodesChange={onNodesChange}
					edges={edges}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					defaultEdgeOptions={defaultEdgeOptions}
					connectionLineType={ConnectionLineType.SmoothStep}
					fitView
				>
					<Background />
				</ReactFlow>
			</div>
		</>
	);
}

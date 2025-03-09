/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

function SortableItem({ id, text }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px',
        margin: '5px 0',
        backgroundColor: 'lightblue',
        border: '1px solid blue',
        cursor: 'grab',
    };

    return (
        <div className='border border-warning' ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {text}
        </div>
    );
}

function TodoList() {
    const [tasks, setTasks] = useState([
        { id: '1', text: 'Task 1' },
        { id: '2', text: 'Task 2' },
        { id: '3', text: 'Task 3' },
        { id: '4', text: 'Task 1' },
        { id: '5', text: 'Task 2' },
        { id: '6', text: 'Task 3' },
    ]);

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex(task => task.id === active.id);
            const newIndex = tasks.findIndex(task => task.id === over.id);
            setTasks(arrayMove(tasks, oldIndex, newIndex));
        }
    }

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                {tasks.map(task => (
                    <SortableItem key={task.id} id={task.id} text={task.text} />
                ))}
            </SortableContext>
        </DndContext>
    );
}

export default TodoList;

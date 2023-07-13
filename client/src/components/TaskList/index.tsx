import React from 'react';
import TaskCard from 'components/TaskCard';
import { useQuery } from 'react-query';
import { getTodos } from 'api/getTodos';

const TaskList: React.FC = () =>{
  const { isLoading,isError, error,data } = useQuery(`todos`,getTodos)
  
  if(isLoading){
    return(
      <div>is Loading...</div>
    )
  }

  if(isError){
    return(
      <div>is Error.... {error}</div>
    )
  }

  return(
    <section className="flex flex-col overflow-x-hiden overflow-y-auto h-taskList rounded">
      
      {data?.todos.map((todo)=>{
        return(
          <TaskCard key={todo._id} title={todo.title} taskId={todo._id} status={todo.status}
            />
        )
      })}

      </section>
    )
}

export default TaskList


import type { IndexedWorkItem, MetricSystem } from "@/types";
import WorkItemInput from "./WorkItemInput";
import { useState } from "react";


interface WorkItemsTableProps {
    workItems: IndexedWorkItem[]
    metricSystem: MetricSystem
    chapterId: string
}

export default function WorkItemsTable({ workItems, metricSystem, chapterId }: WorkItemsTableProps) {
    const [isCreatingWorkItem, setIsCreatingWorkItem] = useState(false)


    return (
        <table className="workitems">
            {(workItems.length > 0 || isCreatingWorkItem) && (
                <thead>
                    <tr>
                        <th className="w-[50px]" >{workItems.length > 0 ? 'Nº' : ''}</th>
                        <th>Concept</th>
                        <th className="w-[70px]" >Quantity</th>
                        <th className="w-[70px]" >Unit</th>
                        <th className="w-[120px]" >Unit price</th>
                        <th className="w-[120px]" >Total</th>
                        <th className="w-[80px]" >Margin</th>
                        <th className="w-[120px]" >Unit price</th>
                        <th className="w-[120px]" >Total</th>
                    </tr>
                </thead>
            )}
            <tbody>
                {workItems.map((workItem, index) => (
                    <tr key={workItem.id}>
                        <WorkItemInput
                            metricSystem={metricSystem}
                            chapterId={chapterId}
                            workItem={workItem}
                        />
                    </tr>
                ))}

                <tr>
                    {isCreatingWorkItem || workItems.length > 0 ? (
                        <>
                            <td>
                                {workItems.length === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingWorkItem(false)}
                                        className="btn btn--tertiary"
                                        aria-label="Cancel"
                                    >
                                        <i className="icon-close text-20" aria-hidden="true"></i>
                                    </button>
                                )}
                            </td>
                            <WorkItemInput
                                metricSystem={metricSystem}
                                chapterId={chapterId}
                            />
                        </>
                    ) : (
                        <td colSpan={9}>
                            <button
                                type="button"
                                onClick={() => setIsCreatingWorkItem(true)}
                                className="btn btn--tertiary text-12"
                            >
                                <i className="icon-plus text-20" aria-hidden="true"></i>
                                New workitem
                            </button>
                        </td>
                    )}
                </tr>
            </tbody>
        </table>
    )
}
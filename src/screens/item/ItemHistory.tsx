import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useQueryClient } from 'react-query'

import type {
  DatasetDto,
  PublicationDto,
  ToolDto,
  TrainingMaterialDto,
  WorkflowDto,
} from '@/api/sshoc'
import {
  useRevertDataset,
  useRevertPublication,
  useRevertTool,
  useRevertTrainingMaterial,
  useRevertWorkflow,
} from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { toast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import ProtectedView from '@/modules/auth/ProtectedView'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import { Anchor } from '@/modules/ui/Anchor'

export interface ItemHistoryProps {
  item:
    | DatasetDto
    | PublicationDto
    | ToolDto
    | TrainingMaterialDto
    | WorkflowDto
}

export function ItemHistory(props: ItemHistoryProps): JSX.Element {
  return <div>Work in progress</div>
}

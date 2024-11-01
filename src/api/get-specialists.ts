import { api } from '@/lib/axios'

export interface SpecialtyOption {
  value: string
  label: string
}

export interface GetSpecialistsResponse {
  specialists: {
    id: string
    name: string
  }[]
}

export async function getSpecialists(): Promise<SpecialtyOption[]> {
  try {
    const response = await api.get<GetSpecialistsResponse>('/specialists')

    if (response.data && response.data.specialists) {
      const formattedSpecialists = response.data.specialists.map(
        (specialty) => ({
          value: specialty.id,
          label: specialty.name,
        }),
      )

      return formattedSpecialists
    } else {
      console.warn('Nenhuma especialidade encontrada no retorno da API.')
      return []
    }
  } catch (error) {
    console.error('Erro ao buscar especialidades:', error)
    return []
  }
}

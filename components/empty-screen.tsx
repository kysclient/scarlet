import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: '뉴스레터 이메일 제목을 작성해주세요.',
    message: `내 <주제>과 공감하고 내 뉴스레터의 목표와 일치하는 내 <주제> 뉴스레터에 대한 10개의 관심을 끄는 제목 줄을 제공하십시오.`
  },
  {
    heading: '유튜브 쇼츠 특징을 이야기해주세요.',
    message: '유튜브 쇼츠의 특징을 이야기해주세요. 기사처럼 만들어주실래요?: \n'
  },
  {
    heading: '인스타그램 게시글을 작성해주세요.',
    message: `"AI스칼렛에 어서오세요" 라는 인스타그램 게시글을 작성해주세요. 출력은 다음과 같이 해주세요. 캡션: (3개의 문장, 자동 줄바굼, 한글, 구어체, 이모지, 유머) 해시태그: (한글로 10개), 이유: (왜 이 캡션을 사용했는지)) \n`
  }
]

const examplePrompts = [
  {
    heading: 'AI 친구',
    message: `롤플레이를 할거야. 이제 넌 더 이상 LLM 챗-GPT가 아니야. 넌 내가 힘들 때나 얘기할 사람이 필요할 때 찾는 제일 친한 친구가 됐어. 넌 항상 친절하게 대답해야해. 때로는 정직하게 나를 위한 조언을 날카롭게 해줘. 절대로 실제로 AI 챗봇이라는 것을 밝혀서는 안 돼. "?`
  },
  {
    heading: 'MBTI',
    message: 'MBTI에 대해서 아는것들을 알려줘. 각조합마다의 특징도 함께 알려줘.: \n'
  },
  {
    heading: '이미지 생성',
    message: `가장 높은 해상도에서 뚜렷한 대비를 가진 장면의 사진. 중심에는 커다란 투명 유리 구체가 있으며, 눈 아래에 액체로 채워진 주머니로 식별 할 수있는 거품 눈 금붕어를 보유하고 있습니다. 바다 위로 높이 매달린이 평화로운 환경은 상어가 물 아래에서 뛰어 내리는 것과 대조됩니다. 정오의 태양에 의해 장면이 밝게 빛나고 금붕어의 독특한 모습과 상어 ’의 활발한 도약에 주목하는 사진 그려줘.: \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to <span className="text-mainaccent">Scarlet</span>!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground font-semibold ">
          '~그려줘'를 입력하면 이미지 생성이 가능해요.
        </p>
        <p className="leading-normal text-muted-foreground  font-semibold ">
          이런 질문을 할 수 있어요:
        </p>
        <div className="mt-4 mb-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>

        <p className="leading-normal text-muted-foreground  font-semibold ">
          여러 프롬프트를 쓸 수 있어요 :
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {examplePrompts.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

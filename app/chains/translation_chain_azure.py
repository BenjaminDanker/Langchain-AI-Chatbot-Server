import asyncio
import logging
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate
from app.config import settings

logger = logging.getLogger(__name__)

async def initialize_translation_chain():
    """
    Initializes a translation chain using the new RunnableSequence style.
    This chain is composed by piping a prompt template into the LLM.
    """
    logger.info("Starting translation chain initialization...")
    
    # Initialize LLM for translation
    llm = await asyncio.to_thread(
        AzureChatOpenAI,
        model_name =        settings.AZURE_MODEL_NAME,
        azure_deployment =  settings.AZURE_DEPLOYMENT_NAME,
        azure_endpoint =    settings.AZURE_OPENAI_ENDPOINT,  # e.g., "https://your-resource-name.openai.azure.com/"
        api_key =           settings.AZURE_OPENAI_API_KEY,
        temperature =       settings.TEMPERATURE,
        request_timeout =   settings.REQUEST_TIMEOUT,
        api_version =       settings.AZURE_API_VERSION,
    )
    logger.info("LLM loaded for translation")
    
    # Create prompt template for translation
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "Translate the following text to {target_lang}. Provide only the translation."
        ),
        ("human", "{faq}")
    ])
    logger.info("Prompt created for translation chain")
    
    # Compose the translation chain using the new style: prompt | llm
    # This creates a pipeline where the prompt processes the input and passes it to the LLM.
    translation_chain = prompt | llm
    logger.info("Translation chain initialized using RunnableSequence (prompt | llm)")
    
    return translation_chain

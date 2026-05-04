# pip install crewai crewai_tools langchain langchain_community streamlit duckduckgo-search groq

import streamlit as st
from crewai import LLM, Agent, Task, Crew, Process
from crewai.tools import tool
from langchain_community.tools import DuckDuckGoSearchResults
import os


st.set_page_config(
    page_title="🌍 AI Travel Planner",
    page_icon="✈️",
    layout="wide",
)

st.title("✈️ AI Travel Planner — Powered by Groq + CrewAI")
st.markdown("Generate a personalized travel plan with **3 downloadable reports** in your preferred language.")

# ─── 20 Supported Languages ───────────────────────────────────────────────────

SUPPORTED_LANGUAGES = {
    "English":    "English",
    "Tamil":      "Tamil (தமிழ்)",
    "Hindi":      "Hindi (हिन्दी)",
    "French":     "French (Français)",
    "Spanish":    "Spanish (Español)",
    "German":     "German (Deutsch)",
    "Italian":    "Italian (Italiano)",
    "Portuguese": "Portuguese (Português)",
    "Japanese":   "Japanese (日本語)",
    "Korean":     "Korean (한국어)",
    "Chinese":    "Chinese Simplified (简体中文)",
    "Arabic":     "Arabic (العربية)",
    "Russian":    "Russian (Русский)",
    "Turkish":    "Turkish (Türkçe)",
    "Dutch":      "Dutch (Nederlands)",
    "Polish":     "Polish (Polski)",
    "Swedish":    "Swedish (Svenska)",
    "Greek":      "Greek (Ελληνικά)",
    "Indonesian": "Indonesian (Bahasa Indonesia)",
    "Thai":       "Thai (ภาษาไทย)",
}

# ─── Sidebar Inputs ───────────────────────────────────────────────────────────

with st.sidebar:
    st.header("🛫 Trip Details")

    groq_api_key =os.getenv("GROQ_API_KEY")
    st.divider()

    from_city        = st.text_input("📍 Traveling From", value="India")
    destination_city = st.text_input("🏙️ Destination City", value="Rome")
    date_from        = st.text_input("📅 Arrival Date", value="1st March 2025")
    date_to          = st.text_input("📅 Departure Date", value="7th March 2025")
    interests        = st.text_input("🎯 Your Interests", value="sightseeing and good food")

    st.divider()

    language_key = st.selectbox(
        "🌐 Preferred Language",
        options=list(SUPPORTED_LANGUAGES.keys()),
        index=0,
    )
    language = SUPPORTED_LANGUAGES[language_key]

    generate_btn = st.button("🚀 Generate Travel Plan", use_container_width=True, type="primary")

# ─── Tool ─────────────────────────────────────────────────────────────────────

@tool
def search_web_tool(query: str) -> str:
    """Searches the web and returns results."""
    search_tool = DuckDuckGoSearchResults(num_results=10, verbose=True)
    return search_tool.run(query)

# ─── Agent + Task Factories ───────────────────────────────────────────────────

def build_agents(llm, language):
    location_expert = Agent(
        role="Travel Trip Expert",
        goal=f"Gather helpful travel information about the destination city. ALWAYS respond ONLY in {language}.",
        backstory=f"A seasoned traveler who knows travel logistics inside out. You always communicate in {language}.",
        tools=[search_web_tool],
        verbose=True,
        max_iter=5,
        llm=llm,
        allow_delegation=False,
    )

    guide_expert = Agent(
        role="City Local Guide Expert",
        goal=f"Provide information on things to do based on traveler interests. ALWAYS respond ONLY in {language}.",
        backstory=f"A local expert passionate about sharing hidden gems and best experiences. You always communicate in {language}.",
        tools=[search_web_tool],
        verbose=True,
        max_iter=5,
        llm=llm,
        allow_delegation=False,
    )

    planner_expert = Agent(
        role="Travel Planning Expert",
        goal=f"Compile all gathered information into a comprehensive travel plan. ALWAYS respond ONLY in {language}.",
        backstory=f"An organizational wizard who turns possibilities into seamless itineraries. You always communicate in {language}.",
        tools=[search_web_tool],
        verbose=True,
        max_iter=5,
        llm=llm,
        allow_delegation=False,
    )

    return location_expert, guide_expert, planner_expert


def make_location_task(agent, from_city, destination_city, date_from, date_to, language):
    return Task(
        description=f"""
        ⚠️ CRITICAL: Your ENTIRE response MUST be written in {language} only. No other language is allowed.

        Collect comprehensive travel information for the traveler:
        - Accommodation options (budget hostels to luxury hotels) with estimated costs
        - Daily living expenses breakdown
        - Transportation options (flights, trains, local transport)
        - Visa requirements for travelers from {from_city}
        - Travel advisories and safety tips
        - Weather forecast for the travel dates
        - Relevant events during the trip period

        Traveling from   : {from_city}
        Destination city : {destination_city}
        Arrival Date     : {date_from}
        Departure Date   : {date_to}
        """,
        expected_output=f"""
        ⚠️ Respond ONLY in {language}.
        A detailed markdown report including:
        - Recommended places to stay with price ranges
        - Daily living expenses breakdown
        - Visa and entry requirements
        - Weather summary for travel dates
        - Practical travel tips
        """,
        agent=agent,
        output_file="city_report.md",
    )


def make_guide_task(agent, destination_city, interests, date_from, date_to, language):
    return Task(
        description=f"""
        ⚠️ CRITICAL: Your ENTIRE response MUST be written in {language} only. No other language is allowed.

        Create a personalized city guide tailored to the traveler's interests: {interests}
        Cover cultural landmarks, historical spots, dining experiences, and outdoor activities.
        Highlight seasonal events and festivals during the visit.

        Destination city : {destination_city}
        Interests        : {interests}
        Arrival Date     : {date_from}
        Departure Date   : {date_to}
        """,
        expected_output=f"""
        ⚠️ Respond ONLY in {language}.
        A personalized markdown guide with:
        - Top attractions matching the traveler's interests
        - Recommended restaurants and local food experiences
        - Cultural and seasonal events during the trip
        - Locations, opening hours, and booking tips
        """,
        agent=agent,
        output_file="guide_report.md",
    )


def make_planner_task(context, agent, destination_city, interests, date_from, date_to, language):
    return Task(
        description=f"""
        ⚠️ CRITICAL: Your ENTIRE response MUST be written in {language} only. No other language is allowed.

        Synthesize all collected information into a cohesive day-by-day travel plan.
        Include a city introduction (3 paragraphs), daily schedule with time allocations,
        transportation tips, and budget overview.

        Destination city : {destination_city}
        Interests        : {interests}
        Arrival Date     : {date_from}
        Departure Date   : {date_to}
        """,
        expected_output=f"""
        ⚠️ Respond ONLY in {language}.
        A rich markdown document with emojis on each title/subtitle:

        # 🌍 Welcome to {destination_city}
        - 3-paragraph city introduction
        - Daily living expenses breakdown
        - Must-visit spots overview

        # 🗺️ Your Travel Plan for {destination_city}
        - Day-by-day itinerary with time slots
        - Activity details and recommendations
        - Transportation and navigation tips
        """,
        context=context,
        agent=agent,
        output_file="travel_plan.md",
    )

# ─── Main Logic ───────────────────────────────────────────────────────────────

if generate_btn:
    if not groq_api_key:
        st.error("❌ Please enter your Groq API key in the sidebar.")
        st.stop()

    if not all([from_city, destination_city, date_from, date_to, interests]):
        st.error("❌ Please fill in all trip details.")
        st.stop()

    st.info(f"🌐 Generating your travel plan in **{language}** for **{destination_city}**...")

    with st.spinner("🤖 CrewAI agents are researching your trip... (this may take 1–3 minutes)"):
        try:
            llm = LLM(
                model="groq/llama-3.3-70b-versatile",
                api_key=groq_api_key,
                temperature=0.7,
            )

            location_expert, guide_expert, planner_expert = build_agents(llm, language)

            loc_task  = make_location_task(location_expert, from_city, destination_city, date_from, date_to, language)
            gd_task   = make_guide_task(guide_expert, destination_city, interests, date_from, date_to, language)
            plan_task = make_planner_task([loc_task, gd_task], planner_expert, destination_city, interests, date_from, date_to, language)

            crew = Crew(
                agents=[location_expert, guide_expert, planner_expert],
                tasks=[loc_task, gd_task, plan_task],
                process=Process.sequential,
                share_crew=False,
                verbose=False,
            )

            crew.kickoff()

            # Read generated files
            def read_file(path):
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        return f.read()
                except FileNotFoundError:
                    return f"⚠️ File `{path}` was not generated. Please try again."

            city_report   = read_file("city_report.md")
            guide_report  = read_file("guide_report.md")
            travel_plan   = read_file("travel_plan.md")

            st.success("✅ Travel plan generated successfully!")
            st.divider()

            # ─── Display + Download ────────────────────────────────────────────

            tab1, tab2, tab3 = st.tabs(["📋 City Report", "🗺️ Guide Report", "📅 Travel Plan"])

            with tab1:
                st.markdown(city_report)
                st.download_button(
                    label="⬇️ Download City Report",
                    data=city_report,
                    file_name=f"city_report_{destination_city.replace(' ', '_')}.md",
                    mime="text/markdown",
                    use_container_width=True,
                )

            with tab2:
                st.markdown(guide_report)
                st.download_button(
                    label="⬇️ Download Guide Report",
                    data=guide_report,
                    file_name=f"guide_report_{destination_city.replace(' ', '_')}.md",
                    mime="text/markdown",
                    use_container_width=True,
                )

            with tab3:
                st.markdown(travel_plan)
                st.download_button(
                    label="⬇️ Download Travel Plan",
                    data=travel_plan,
                    file_name=f"travel_plan_{destination_city.replace(' ', '_')}.md",
                    mime="text/markdown",
                    use_container_width=True,
                )

        except Exception as e:
            st.error(f"❌ Error: {str(e)}")
            st.markdown("**Common fixes:**")
            st.markdown("- Check your Groq API key is valid at [console.groq.com](https://console.groq.com)")
            st.markdown("- Make sure all packages are installed: `pip install crewai crewai_tools langchain langchain_community streamlit duckduckgo-search groq`")

else:
    # Landing state
    st.markdown("---")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("### 📋 City Report\nAccommodations, costs, visa requirements, weather & events")
    with col2:
        st.markdown("### 🗺️ Guide Report\nAttractions, restaurants & local experiences tailored to your interests")
    with col3:
        st.markdown("### 📅 Travel Plan\nDay-by-day itinerary with time slots & transport tips")

    st.markdown("---")
    st.markdown("**👈 Fill in your trip details in the sidebar and click Generate to start.**")
    st.markdown(f"**🌐 Supports 20 languages:** {', '.join(list(SUPPORTED_LANGUAGES.keys()))}")
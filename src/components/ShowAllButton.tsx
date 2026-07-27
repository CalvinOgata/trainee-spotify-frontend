type ShowAllButtonProps = {
  onClick?: () => void
}

function ShowAllButton({ onClick }: ShowAllButtonProps) {
  return (
    <button
      onClick={onClick}
      className="font-[Inter] text-[10px] font-bold text-[#B3B3B3] hover:text-white"
    >
      Mostrar tudo
    </button>
  )
}

export default ShowAllButton

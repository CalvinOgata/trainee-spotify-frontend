type ShowAllButtonProps = {
  onClick?: () => void
  expanded?: boolean
}

function ShowAllButton({ onClick, expanded = false }: ShowAllButtonProps) {
  return (
    <button
      onClick={onClick}
      className="font-[Inter] text-[10px] font-bold text-[#B3B3B3] hover:text-white"
    >
      {expanded ? 'Mostrar menos' : 'Mostrar tudo'}
    </button>
  )
}

export default ShowAllButton

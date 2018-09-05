# app/utilities.py


def check_empty_dict(args):
    """Function to check if an empty value's been given for any key"""
    for key in args:
        if not args[key].strip():
            return True
    return False
